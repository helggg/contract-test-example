import os
import pytest

from uuid import uuid4
from pact import Verifier
from pydantic import BaseModel
from typing import Any, Generator
from multiprocessing import Process

from main import app, posts

PACT_FILE_URL = os.path.join(os.path.dirname(__file__), "../../pacts", "pactwitter-awesome-backend.json")
SERVICE_HOST = "localhost"
SERVICE_PORT = 8000
HANDLER_STATE_URI = "/_pact/provider_states"

class ProviderState(BaseModel):
    state: str
    consumer: str

@app.post(HANDLER_STATE_URI)
def service_state_mapping(state: ProviderState):
    state_mapping = {
        "posts exist": lambda: posts.append({"id": f"{uuid4()}", "content": "Hello, World!"}),
        "no posts": lambda: posts.clear()
    }
    state_mapping[state.state]()

def run_server():
    import uvicorn
    uvicorn.run(app, host=SERVICE_HOST, port=SERVICE_PORT)

@pytest.fixture(scope="module")
def test_service_base_url() -> Generator[str, Any, None]:
    process = Process(target=run_server, daemon=True)
    process.start()
    yield f"http://{SERVICE_HOST}:{SERVICE_PORT}"
    process.terminate()

@pytest.fixture(scope="module")
def pact_verifier(test_service_base_url) -> Generator[Verifier, Any, None]:
    yield Verifier(provider="awesome-backend", provider_base_url=test_service_base_url)

def test_provider_verify(pact_verifier, test_service_base_url):
    success, _ = pact_verifier.verify_pacts(PACT_FILE_URL, provider_states_setup_url=f"{test_service_base_url}{HANDLER_STATE_URI}")
    assert success == 0
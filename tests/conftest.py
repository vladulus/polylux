"""Test setup — ensures PyQt6 widget tests can run headless on CI/Windows."""
import os

# Force offscreen Qt platform so pytest-qt doesn't require an actual display.
os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

import pytest  # noqa: E402
from PyQt6.QtWidgets import QApplication  # noqa: E402


@pytest.fixture(scope="session")
def qapp():
    """Single QApplication shared across all UI tests in the session."""
    app = QApplication.instance() or QApplication([])
    yield app

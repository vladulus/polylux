"""Dashboard page — placeholder until Task 16."""
from PyQt6.QtWidgets import QLabel, QVBoxLayout, QWidget

from polylux.ui.state import ServiceState


class DashboardPage(QWidget):
    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        v = QVBoxLayout(self)
        v.addWidget(QLabel("Dashboard — coming soon"))

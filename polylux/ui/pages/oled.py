"""OLED page — placeholder until Task 18."""
from PyQt6.QtWidgets import QLabel, QVBoxLayout, QWidget

from polylux.ui.state import ServiceState


class OledPage(QWidget):
    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        v = QVBoxLayout(self)
        v.addWidget(QLabel("OLED — coming soon"))

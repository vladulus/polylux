"""Aura RGB page — placeholder until Task 19."""
from PyQt6.QtWidgets import QLabel, QVBoxLayout, QWidget

from polylux.ui.state import ServiceState


class AuraRGBPage(QWidget):
    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        v = QVBoxLayout(self)
        v.addWidget(QLabel("Aura RGB — coming soon"))

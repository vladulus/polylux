"""Matrix page — placeholder until Task 17."""
from PyQt6.QtWidgets import QLabel, QVBoxLayout, QWidget

from polylux.ui.state import ServiceState


class MatrixPage(QWidget):
    def __init__(self, state: ServiceState) -> None:
        super().__init__()
        v = QVBoxLayout(self)
        v.addWidget(QLabel("Anime Matrix — coming soon"))

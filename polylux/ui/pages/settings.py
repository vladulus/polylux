"""Settings page — placeholder until Task 21."""
from PyQt6.QtWidgets import QLabel, QVBoxLayout, QWidget

from polylux.ui.skin import Skin
from polylux.ui.state import ServiceState


class SettingsPage(QWidget):
    def __init__(self, state: ServiceState, skin: Skin) -> None:
        super().__init__()
        v = QVBoxLayout(self)
        v.addWidget(QLabel("Settings — coming soon"))

from django.core.management.commands.runserver import Command as BaseRunserverCommand
from django.db.utils import OperationalError


class Command(BaseRunserverCommand):
    """
    Enhanced runserver command that gracefully handles disconnected databases
    during development without crashing the web process.
    """

    def check_migrations(self):
        try:
            super().check_migrations()
        except OperationalError as err:
            self.stdout.write(
                self.style.WARNING(
                    f"Notice: Database check skipped (offline or unreachable): {err}"
                )
            )
        except Exception as err:
            self.stdout.write(
                self.style.WARNING(
                    f"Notice: Database check skipped: {err}"
                )
            )

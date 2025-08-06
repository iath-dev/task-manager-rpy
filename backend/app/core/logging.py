from loguru import logger
import sys

def setup_logging():
    logger.remove()  # Quita el handler por defecto
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
               "<level>{level: <8}</level> | "
               "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
               "<level>{message}</level>",
        level="DEBUG",  # Cambia a INFO o WARNING en producción
    )

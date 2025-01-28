from loguru import logger
import sys
import os

# Log directory setup
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

# Log file path
LOG_FILE = os.path.join(LOG_DIR, "app.log")

# Configure Loguru
logger.remove()  # Remove default handler
logger.add(
    sys.stderr,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="INFO",
)
logger.add(
    LOG_FILE,
    rotation="10 MB",
    retention="7 days",
    level="INFO",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
)

# Helper for structured logging
def log_request_details(endpoint: str, query_params: dict = None, body: dict = None):
    logger.info(f"Endpoint: {endpoint}")
    if query_params:
        logger.info(f"Query Parameters: {query_params}")
    if body:
        logger.info(f"Request Body: {body}")

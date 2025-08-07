# 1. Use la imagen base oficial de Python
FROM python:3.11-slim

# 2. Establecer el directorio de trabajo
WORKDIR /app

# 3. Instalar Poetry
RUN pip install poetry

# 4. Copiar los archivos de dependencias
COPY poetry.lock pyproject.toml /app/

# 5. Instalar las dependencias del proyecto
RUN poetry config virtualenvs.create false && poetry install --no-dev --no-interaction --no-ansi

# 6. Copiar el código de la aplicación
COPY ./app /app/app

# 7. Exponer el puerto que utiliza la aplicación
EXPOSE 8000

# 8. Comando para ejecutar la aplicación
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

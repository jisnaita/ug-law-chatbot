import json
from fastapi.openapi.utils import get_openapi
from src.main import app

def generate_schema():
    openapi_schema = get_openapi(
        title="Uganda Laws Chatbot API",
        version="1.0.0",
        description="API for Uganda Laws Chatbot",
        routes=app.routes,
    )
    
    # Filter for only the retrieval endpoint if desired, or keep all
    # For Custom GPT, it's often cleaner to only expose what's needed
    # But for simplicity, we'll dump the whole thing and the user can copy the relevant part
    # or we can filter specifically for /api/v1/retrieval/search
    
    # Let's try to filter for just the retrieval path to make it clean for the user
    paths = openapi_schema.get("paths", {})
    retrieval_path = "/api/v1/retrieval/search"
    
    if retrieval_path in paths:
        filtered_schema = {
            "openapi": "3.1.0",
            "info": openapi_schema["info"],
            "servers": [{"url": "https://your-api-url.com"}], # Placeholder
            "paths": {
                retrieval_path: paths[retrieval_path]
            },
            "components": {
                "schemas": {}
            }
        }
        
        # Add referenced schemas
        # This is a bit naive, but works for simple cases. 
        # A full recursive resolver would be better but might be overkill here.
        # Let's just dump the full components to be safe.
        filtered_schema["components"] = openapi_schema.get("components", {})
        
        with open("custom_gpt_schema.json", "w") as f:
            json.dump(filtered_schema, f, indent=2)
        print("Schema generated: custom_gpt_schema.json")
    else:
        print(f"Path {retrieval_path} not found in schema")

if __name__ == "__main__":
    generate_schema()

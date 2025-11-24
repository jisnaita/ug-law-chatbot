import requests
import json

def fetch_and_filter_schema():
    try:
        # Fetch full schema from running app
        response = requests.get("http://localhost:8000/openapi.json")
        response.raise_for_status()
        openapi_schema = response.json()
        
        # Filter for retrieval endpoint
        paths = openapi_schema.get("paths", {})
        retrieval_path = "/api/v1/retrieval/search"
        
        if retrieval_path in paths:
            filtered_schema = {
                "openapi": "3.1.0",
                "info": openapi_schema["info"],
                "servers": [{"url": "https://your-api-url.com"}], 
                "paths": {
                    retrieval_path: paths[retrieval_path]
                },
                "components": openapi_schema.get("components", {})
            }
            
            with open("custom_gpt_schema.json", "w") as f:
                json.dump(filtered_schema, f, indent=2)
            print("Schema generated: custom_gpt_schema.json")
        else:
            print(f"Path {retrieval_path} not found in schema. Make sure the backend has reloaded with the new changes.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_and_filter_schema()

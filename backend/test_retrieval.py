import requests
import json

def test_retrieval():
    url = "http://localhost:8000/api/v1/retrieval/search"
    payload = {
        "query": "Mr. Kugonza Denis",
        "limit": 3
    }
    
    try:
        print(f"Sending request to {url}...")
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            print("Success! Response:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Failed with status {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_retrieval()

import requests
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def upload_to_supabase(bucket_name, file_path, file_obj):
    """
    Uploads file to Supabase storage and returns public URL.
    """
    url = f"{SUPABASE_URL}/storage/v1/object/{bucket_name}/{file_path}"
    
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/octet-stream"
    }

    # Upload
    response = requests.post(url, headers=headers, data=file_obj.read())
    
    # ✅ If file already exists, overwrite
    if response.status_code == 409:
        response = requests.put(url, headers=headers, data=file_obj.read())

    if response.status_code not in (200, 201):
        raise Exception(f"Supabase upload failed: {response.text}")

    # ✅ Always return public URL
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket_name}/{file_path}"
    return public_url

#!/usr/bin/env python3
"""
Create Gmail drafts from CSV file for SBK8 auction emails.
Requires: pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
"""

import csv
import base64
from email.mime.text import MIMEText
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.exceptions import RefreshError
from googleapiclient.discovery import build
import os

# Gmail API scopes
SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
TOKEN_FILE = 'token.json'
CREDENTIALS_FILE = 'credentials.json'

def authenticate():
    """Authenticate with Gmail API."""
    creds = None

    # Load existing token
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # Refresh or get new token
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    elif not creds or not creds.valid:
        if not os.path.exists(CREDENTIALS_FILE):
            print(f"❌ {CREDENTIALS_FILE} not found!")
            print("\nTo get started:")
            print("1. Go to https://console.cloud.google.com/")
            print("2. Create a new project")
            print("3. Enable Gmail API")
            print("4. Create OAuth 2.0 credentials (Desktop app)")
            print("5. Download credentials and save as 'credentials.json'")
            print("6. Run this script again")
            return None

        flow = InstalledAppFlow.from_client_secrets_file(
            CREDENTIALS_FILE, SCOPES)
        creds = flow.run_local_server(port=0)

        # Save token for next time
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())

    return creds

def create_draft(service, to, subject, body):
    """Create a Gmail draft."""
    try:
        message = MIMEText(body)
        message['to'] = to
        message['subject'] = subject

        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()

        draft = {
            'message': {
                'raw': raw
            }
        }

        created = service.users().drafts().create(userId='me', body=draft).execute()
        return created['id']
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return None

def main():
    print("🌟 SBK8 Auction Email Draft Creator\n")

    # Authenticate
    creds = authenticate()
    if not creds:
        return

    service = build('gmail', 'v1', credentials=creds)

    # Read CSV and create drafts
    csv_file = 'emails_for_gmail.csv'
    if not os.path.exists(csv_file):
        print(f"❌ {csv_file} not found!")
        return

    print(f"📧 Reading {csv_file}...\n")

    drafts_created = 0
    errors = 0

    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, 1):
            to = row['to']
            subject = row['subject']
            body = row['body']

            print(f"{i}. Creating draft to {to}...", end=" ")
            draft_id = create_draft(service, to, subject, body)
            if draft_id:
                print("✅")
                drafts_created += 1
            else:
                print("❌")
                errors += 1

    print(f"\n{'='*50}")
    print(f"✨ Complete! {drafts_created} drafts created")
    if errors:
        print(f"⚠️  {errors} errors")
    print(f"{'='*50}")
    print("\n👉 Check your Gmail drafts folder!")

if __name__ == '__main__':
    main()

import os

from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = (
        "Ensure the media bucket exists and is PRIVATE. Best-effort: never fails "
        "the process, so a MinIO/S3 outage cannot stop the API from booting."
    )

    def handle(self, *args, **options):
        if not getattr(settings, "USE_S3", False):
            self.stdout.write("USE_S3 is off — skipping (local filesystem storage).")
            return

        try:
            import boto3
            from botocore.client import Config
            from botocore.exceptions import ClientError

            bucket = settings.AWS_STORAGE_BUCKET_NAME
            client = boto3.client(
                "s3",
                endpoint_url=os.environ.get("AWS_S3_ENDPOINT_URL"),
                aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
                region_name=os.environ.get("AWS_S3_REGION_NAME", "us-east-1"),
                config=Config(
                    signature_version="s3v4",
                    s3={"addressing_style": "path"},
                    connect_timeout=5,
                    retries={"max_attempts": 1},
                ),
            )

            try:
                client.head_bucket(Bucket=bucket)
                self.stdout.write(f"Bucket '{bucket}' already exists.")
            except ClientError:
                client.create_bucket(Bucket=bucket)
                self.stdout.write(self.style.SUCCESS(f"Created bucket '{bucket}'."))

            # Keep the bucket PRIVATE — objects are served only through the
            # authenticated, time-limited Django endpoint.
            try:
                client.delete_bucket_policy(Bucket=bucket)
                self.stdout.write("Removed any public bucket policy (bucket is private).")
            except ClientError:
                self.stdout.write("Bucket has no public policy (already private).")

        except Exception as exc:  # noqa: BLE001 (best-effort: never block startup)
            self.stderr.write(
                self.style.WARNING(
                    f"init_storage: could not reach object storage ({exc!r}). "
                    "Continuing startup — photo storage will self-heal when MinIO "
                    "is reachable."
                )
            )

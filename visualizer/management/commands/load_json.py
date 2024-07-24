import json
from django.core.management.base import BaseCommand, CommandError
from visualizer.models import Insight
from django.utils.dateparse import parse_datetime

def load_json_data(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
    except FileNotFoundError:
        raise CommandError(f"The file '{file_path}' does not exist.")

    for data in json_data:
        # Example of checking and converting empty strings to None for integer fields
        for field_name in ['intensity', 'relevance', 'likelihood']:
            if data.get(field_name) == '':
                data[field_name] = None

        # Parse datetime fields
        data['added'] = parse_datetime(data['added'])
        data['published'] = parse_datetime(data['published'])

        # Create or update Insight object
        Insight.objects.get_or_create(
            end_year=data.get('end_year', ''),
            intensity=data.get('intensity', 0),
            sector=data.get('sector', ''),
            topic=data.get('topic', ''),
            insight=data.get('insight', ''),
            url=data.get('url', ''),
            region=data.get('region', ''),
            start_year=data.get('start_year', ''),
            impact=data.get('impact', ''),
            added=data['added'],
            published=data['published'],
            country=data.get('country', ''),
            relevance=data.get('relevance', 0),
            pestle=data.get('pestle', ''),
            source=data.get('source', ''),
            title=data.get('title', ''),
            likelihood=data.get('likelihood', 0),
        )

class Command(BaseCommand):
    help = 'Load JSON data into the database'

    def add_arguments(self, parser):
        parser.add_argument('file', type=str, help='The JSON file to load')

    def handle(self, *args, **kwargs):
        file_path = kwargs['file']
        load_json_data(file_path)
        self.stdout.write(self.style.SUCCESS('Successfully loaded JSON data'))

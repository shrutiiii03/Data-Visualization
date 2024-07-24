
import json
from django.shortcuts import render
from .models import Insight
from .forms import UploadFileForm
from django.utils.dateparse import parse_datetime
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse

def handle_uploaded_file(file):
    try:
        json_data = json.load(file)
        
        for data in json_data:
            for field_name in ['intensity', 'relevance', 'likelihood']:
                if data.get(field_name) == '':
                    data[field_name] = None

            data['added'] = parse_datetime(data['added'])
            data['published'] = parse_datetime(data['published'])

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

        return True  # Return True indicating successful file upload

    except (json.JSONDecodeError, ValueError) as e:
        return str(e)  # Return error message if JSON decoding or parsing fails

def dashboard(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            result = handle_uploaded_file(request.FILES['file'])
            if result is True:
                # Successful upload, show success message in popup
                return render(request, 'dashboard.html', {'success_message': 'File successfully uploaded!'})
            else:
                # Error occurred, show error message in popup
                return render(request, 'dashboard.html', {'error_message': result})
    else:
        form = UploadFileForm()

    # Default rendering of dashboard.html with form and existing records
    records = Insight.objects.all()  
    return render(request, 'dashboard.html', {'form': form, 'records': records})

#views for filtering:
def filter_data(request):
    filters = {}
    end_year = request.GET.get('end_year')
    intensity = request.GET.get('intensity')
    sector = request.GET.get('sector')
    topic = request.GET.get('topic')
    region = request.GET.get('region')
    start_year = request.GET.get('start_year')
    impact = request.GET.get('impact')
    country = request.GET.get('country')
    relevance = request.GET.get('relevance')
    pestle = request.GET.get('pestle')
    source = request.GET.get('source')
    title = request.GET.get('title')
    likelihood = request.GET.get('likelihood')

    if end_year:
        filters['end_year'] = end_year
    if intensity:
        filters['intensity'] = intensity
    if sector:
        filters['sector__icontains'] = sector
    if topic:
        filters['topic__icontains'] = topic
    if region:
        filters['region__icontains'] = region
    if start_year:
        filters['start_year'] = start_year
    if impact:
        filters['impact__icontains'] = impact
    if country:
        filters['country__icontains'] = country
    if relevance:
        filters['relevance'] = relevance
    if pestle:
        filters['pestle__icontains'] = pestle
    if source:
        filters['source__icontains'] = source
    if title:
        filters['title__icontains'] = title
    if likelihood:
        filters['likelihood'] = likelihood

    records = Insight.objects.filter(**filters).order_by('end_year')
    paginator = Paginator(records, 10)  # Paginate with 10 records per page
    page = request.GET.get('page', 1)

    try:
     records = paginator.page(page)
    except PageNotAnInteger:
     records = paginator.page(1)
    except EmptyPage:
     records = paginator.page(paginator.num_pages)

    return render(request, 'dashboard.html', {'records': records})

#view for retrieving values
def intensity_values(request):
    intensities = Insight.objects.values('intensity')
    data = list(intensities)
    return JsonResponse(data, safe=False)

def likelihood_values(request):
    likelihoods = Insight.objects.values('likelihood')
    data = list(likelihoods)
    return JsonResponse(data, safe=False)

def relevance_values(request):
    relevances = Insight.objects.values('relevance')
    data = list(relevances)
    return JsonResponse(data, safe=False)

def year_values(request):
    years = Insight.objects.values('start_year', 'end_year')
    data = list(years)
    return JsonResponse(data, safe=False)

def country_values(request):
    countries = Insight.objects.values('country')
    data = list(countries)
    return JsonResponse(data, safe=False)

def topic_values(request):
    topics = Insight.objects.values('topic')
    data = list(topics)
    return JsonResponse(data, safe=False)

def region_values(request):
    regions = Insight.objects.values('region')
    data = list(regions)
    return JsonResponse(data, safe=False)


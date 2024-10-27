from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title='Blog Backend APIs',
        default_version='v1',
        description='This is a blog website',
        terms_of_service='http://mywebsite.com/policies/',
        contact=openapi.Contact(email='Zubairuabduljelil2017@gmail.com'),
        license=openapi.License(name='BSD License')
    ),
    public=True,
    permission_classes=(permissions.AllowAny,)
)

app_name = 'backend'

urlpatterns = [

    path('admin/', admin.site.urls),
    path('api/v1/', include("api.urls")),
    
    # documentation path
    path("", schema_view.with_ui('swagger', cache_timeout=0), name="schema-swagger-ui"),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
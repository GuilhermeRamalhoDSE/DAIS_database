from django.contrib import admin
from dais.models.detail_models import Detail

@admin.register(Detail)
class DetailAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'id', 'contribution', 'file')
    search_fields = ('id','name',) 
    list_filter = ('name', 'contribution')
    fields = (
        'contribution', 'name', 'file')
    readonly_fields = ()

from django.contrib import admin
from dais.models.detail_models import Detail

@admin.register(Detail)
class DetailAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'contribution', 'file', 'order'
    )
    search_fields = ('id','contribution__id',) 
    list_filter = ('order', 'contribution')
    fields = (
        'contribution', 'file', 'order'
    )
    readonly_fields = ()

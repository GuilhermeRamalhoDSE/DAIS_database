from django.contrib import admin
from dais.models.layer_models import Layer

@admin.register(Layer)
class LayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'layer_number', 'parent', 'period', 'avatar', 'last_update_date')
    list_filter = ('name', 'avatar')
    search_fields = ('name', 'trigger')
    raw_id_fields = ('parent', 'avatar', 'period')

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['parent'].queryset = Layer.objects.exclude(id=obj.id) if obj else Layer.objects.all()
        return form

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "parent":
            kwargs["queryset"] = Layer.objects.order_by('layer_number', 'name')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

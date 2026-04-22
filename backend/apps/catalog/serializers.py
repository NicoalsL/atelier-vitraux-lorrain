from rest_framework import serializers
from .models import Category, Product, ProductImage, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'slug', 'name']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProductImage
        fields = ['id', 'image', 'alt_text']


class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    def get_author_name(self, obj):
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name if name else obj.user.email.split('@')[0]

    class Meta:
        model = Review
        fields = ['id', 'author_name', 'rating', 'title', 'body', 'created_at']
        read_only_fields = ['id', 'author_name', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    thumbnail     = serializers.SerializerMethodField()
    avg_rating    = serializers.SerializerMethodField()
    review_count  = serializers.SerializerMethodField()

    def get_avg_rating(self, obj):
        try:
            ratings = list(obj.reviews.values_list('rating', flat=True))
            return round(sum(ratings) / len(ratings), 1) if ratings else None
        except Exception:
            return None

    def get_review_count(self, obj):
        try:
            return obj.reviews.count()
        except Exception:
            return 0

    def get_thumbnail(self, obj):
        first = obj.images.first()
        if not first:
            return None
        request = self.context.get('request')
        url = first.image.url
        return request.build_absolute_uri(url) if request else url

    class Meta:
        model  = Product
        fields = [
            'id', 'slug', 'name', 'category_slug', 'category_name',
            'price', 'short_description', 'badge', 'in_stock', 'featured',
            'colors', 'thumbnail', 'avg_rating', 'review_count',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category     = CategorySerializer(read_only=True)
    images       = ProductImageSerializer(many=True, read_only=True)
    reviews      = serializers.SerializerMethodField()
    avg_rating   = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    def get_reviews(self, obj):
        try:
            qs = obj.reviews.select_related('user').all()
            return ReviewSerializer(qs, many=True).data
        except Exception:
            return []

    def get_avg_rating(self, obj):
        try:
            ratings = list(obj.reviews.values_list('rating', flat=True))
            return round(sum(ratings) / len(ratings), 1) if ratings else None
        except Exception:
            return None

    def get_review_count(self, obj):
        try:
            return obj.reviews.count()
        except Exception:
            return 0

    class Meta:
        model  = Product
        fields = [
            'id', 'slug', 'name', 'category', 'price',
            'short_description', 'description', 'dimensions',
            'materials', 'lead_time', 'colors', 'badge', 'in_stock',
            'featured', 'images', 'reviews', 'avg_rating', 'review_count', 'created_at',
        ]

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views as api_views

app_name = 'api'


urlpatterns = [
    # UserAuth Endpoint
    path('user/token/', api_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', api_views.RegisterView.as_view(), name='auth_register'),
    path('user/profile/<user_id>/', api_views.ProfileView.as_view(), name='user_profile'),

    # Post Endpoint
    path('category/', api_views.CategoryListView.as_view()),
    path('category/posts/<category_slug>/', api_views.PostCategoryListView.as_view()),
    path('posts/', api_views.PostView.as_view()),
    path('posts/<post_slug>', api_views.PostDetailView.as_view()),
    path('posts/like/', api_views.LikePostView.as_view()),
    path('posts/comment/', api_views.PostCommentView.as_view()),

]

{
    'user_id': '1',
    'post_id': '2',
}
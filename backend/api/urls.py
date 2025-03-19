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
    # path('user/password-reset/<email>/', api_views.PasswordEmailVerify.as_view(), name='password_reset'),
    
    path('team/', api_views.Team.as_view(), name='team'),

    # Post Endpoint
    path('category/', api_views.CategoryListView.as_view()),
    path('category/posts/<category_slug>/', api_views.PostCategoryListView.as_view()),
    path('posts/', api_views.PostView.as_view()),
    path('posts/<post_slug>', api_views.PostDetailView.as_view()),
    path('posts/like/', api_views.LikePostView.as_view()),
    path('posts/comment/', api_views.PostCommentView.as_view()),

    # author endpoints
    path('author/dashboard/stats/<user_id>', api_views.DashboardStats.as_view(), name='dashboardstats'),
    path('author/dashboard/posts/<user_id>', api_views.DashboardPostList.as_view()),
    path('author/dashboard/comments/<user_id>', api_views.DashboardCommentList.as_view()),
    path('author/dashboard/notifications/<user_id>', api_views.DashboardNotificationList.as_view()),
    path('author/dashboard/mark-notification/', api_views.DashboardMarkNofication.as_view()),
    path('author/dashboard/comment-reply/', api_views.DashboardReplyCommentApi.as_view()),
    path('author/dashboard/post-edit/<user_id>/<post_id>/', api_views.DashboardPostEditApi.as_view()),
    path('author/dashboard/post-create/', api_views.DashboardCreatePostApi.as_view()),


]


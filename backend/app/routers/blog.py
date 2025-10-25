from fastapi import APIRouter, HTTPException
from app.schemas import BlogPost


router = APIRouter()


# Mock 데이터
mock_posts = [
    BlogPost(
        id="1",
        title="자영업 성공을 위한 5가지 팁",
        content="자영업을 성공적으로 운영하기 위한 핵심 전략...\n\n1. 꾸준한 재무 관리\n2. 고객 관리\n3. 마케팅...",
        excerpt="자영업 성공의 핵심은 꾸준한 관리와 개선입니다.",
        author="경영 컨설턴트",
        published_at="2024-01-15",
        tags=["경영", "자영업", "팁"],
        image_url="/placeholder.svg",
    ),
    BlogPost(
        id="2",
        title="비용 절감의 기술",
        content="효과적인 비용 관리 방법을 소개합니다...",
        excerpt="불필요한 지출을 줄이는 실용적인 방법들",
        author="재무 전문가",
        published_at="2024-01-10",
        tags=["재무", "비용관리"],
        image_url="/placeholder.svg",
    ),
]


@router.get("", response_model=list[BlogPost])
async def get_blog_posts():
    """블로그 포스트 목록 조회"""
    return mock_posts


@router.get("/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str):
    """특정 블로그 포스트 조회"""
    for post in mock_posts:
        if post.id == post_id:
            return post
    raise HTTPException(status_code=404, detail="블로그 포스트를 찾을 수 없습니다")


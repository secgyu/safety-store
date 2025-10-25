import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBlogPosts } from "@/lib/api";
import { Link } from "react-router-dom";

export default function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">블로그를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">블로그</h1>
          <p className="text-xl text-muted-foreground mb-12">자영업 경영에 도움이 되는 유익한 정보와 팁을 공유합니다</p>

          <div className="grid gap-6">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                          <div className="flex items-center text-sm text-muted-foreground gap-1 ml-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishedAt).toLocaleDateString("ko-KR")}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                        <p className="text-sm text-muted-foreground mb-4">작성자: {post.author}</p>
                        <Button variant="link" className="p-0 h-auto text-primary" asChild>
                          <Link to={`/blog/${post.id}`}>
                            자세히 보기
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">아직 등록된 블로그 포스트가 없습니다.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

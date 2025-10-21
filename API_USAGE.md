# API 사용 가이드

Next.js Route Handler를 MSW + TanStack Query로 변환했습니다.

## 구조

- **MSW Handlers**: `src/mocks/handlers.ts` - 모든 API 엔드포인트 mock
- **TanStack Query Hooks**: `src/lib/api.ts` - React Query hooks
- **API Types**: `src/types/api.ts` - TypeScript 타입 정의

## 사용 예제

### 1. 인증 (Authentication)

```tsx
import { useLogin, useSignup, useAuth, useLogout } from "@/lib/api";

function LoginPage() {
  const login = useLogin();

  const handleLogin = async () => {
    try {
      const result = await login.mutateAsync({
        email: "test@example.com",
        password: "password123",
      });
      console.log("로그인 성공:", result);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return <button onClick={handleLogin}>로그인</button>;
}

function ProfilePage() {
  const { data, isLoading } = useAuth();
  const logout = useLogout();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      <p>환영합니다, {data?.user.name}님!</p>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
```

### 2. 진단 (Diagnosis)

```tsx
import { usePredictDiagnosis, useDiagnosisHistory } from "@/lib/api";

function DiagnosePage() {
  const predict = usePredictDiagnosis();

  const handleDiagnose = async () => {
    try {
      const result = await predict.mutateAsync({
        industry: "음식점",
        yearsInBusiness: 3,
        monthlyRevenue: 50000000,
        monthlyExpenses: 40000000,
        customerCount: 1000,
      });
      console.log("진단 결과:", result);
    } catch (error) {
      console.error("진단 실패:", error);
    }
  };

  return (
    <button onClick={handleDiagnose} disabled={predict.isPending}>
      {predict.isPending ? "진단 중..." : "진단 시작"}
    </button>
  );
}

function HistoryPage() {
  const { data, isLoading } = useDiagnosisHistory();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {data?.diagnoses.map((diagnosis) => (
        <div key={diagnosis.id}>
          <p>점수: {diagnosis.overallScore}</p>
          <p>위험도: {diagnosis.riskLevel}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. 액션 플랜 (Action Plan)

```tsx
import {
  useActionPlans,
  useCreateActionPlan,
  useUpdateActionPlan,
  useDeleteActionPlanItem
} from '@/lib/api'

function ActionPlanPage() {
  const { data: plans, isLoading } = useActionPlans()
  const createPlan = useCreateActionPlan()
  const updatePlan = useUpdateActionPlan()
  const deleteItem = useDeleteActionPlanItem()

  const handleCreate = async () => {
    await createPlan.mutateAsync({
      diagnosisId: 'diagnosis-123',
      items: [
        {
          id: 'item-1',
          title: '비용 절감',
          description: '불필요한 지출 줄이기',
          priority: 'HIGH',
          status: 'pending'
        }
      ]
    })
  }

  const handleUpdate = async (planId: string) => {
    await updatePlan.mutateAsync({
      id: planId,
      data: { items: [...] }
    })
  }

  const handleDeleteItem = async (planId: string, itemId: string) => {
    await deleteItem.mutateAsync({ id: planId, itemId })
  }

  if (isLoading) return <div>로딩 중...</div>

  return (
    <div>
      {plans?.map(plan => (
        <div key={plan.id}>
          {plan.items.map(item => (
            <div key={item.id}>
              <p>{item.title}</p>
              <button onClick={() => handleDeleteItem(plan.id, item.id)}>
                삭제
              </button>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleCreate}>새 플랜 생성</button>
    </div>
  )
}
```

### 4. 벤치마크 (Benchmark)

```tsx
import { useBenchmark, useCompareBenchmark } from "@/lib/api";

function BenchmarkPage() {
  const { data, isLoading } = useBenchmark("음식점", "서울");
  const compare = useCompareBenchmark();

  const handleCompare = async () => {
    const result = await compare.mutateAsync({
      industry: "음식점",
      revenue: 50000000,
      expenses: 40000000,
      customers: 1000,
      riskScore: 75,
    });
    console.log("비교 결과:", result);
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      <p>평균 위험 점수: {data?.averageRiskScore}</p>
      <p>평균 매출: {data?.metrics.revenue.average.toLocaleString()}원</p>
      <button onClick={handleCompare}>비교하기</button>
    </div>
  );
}
```

### 5. 블로그 (Blog)

```tsx
import { useBlogPosts, useBlogPost } from "@/lib/api";

function BlogListPage() {
  const { data: posts, isLoading } = useBlogPosts();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
}

function BlogDetailPage({ postId }: { postId: string }) {
  const { data: post, isLoading } = useBlogPost(postId);

  if (isLoading) return <div>로딩 중...</div>;
  if (!post) return <div>포스트를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.author}</p>
      <div>{post.content}</div>
    </div>
  );
}
```

### 6. 채팅 (Chat)

```tsx
import { useSendChatMessage } from "@/lib/api";
import { useState } from "react";

function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const sendMessage = useSendChatMessage();

  const handleSend = async (content: string) => {
    const newMessages = [...messages, { role: "user", content }];
    setMessages(newMessages);

    try {
      const response = await sendMessage.mutateAsync({
        messages: newMessages,
        context: {
          industry: "음식점",
          businessPeriod: "3년",
        },
      });

      setMessages([...newMessages, { role: "assistant", content: response.message }]);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
      <button onClick={() => handleSend("안녕하세요")}>메시지 보내기</button>
    </div>
  );
}
```

### 7. FAQ

```tsx
import { useFAQs } from "@/lib/api";

function FAQPage() {
  const { data: faqs, isLoading } = useFAQs();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {faqs?.map((faq) => (
        <div key={faq.id}>
          <h3>{faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
```

### 8. 인사이트

```tsx
import { useInsights } from "@/lib/api";

function InsightsPage() {
  const { data: insights, isLoading } = useInsights("음식점");

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {insights?.map((insight) => (
        <div key={insight.id}>
          <h2>{insight.title}</h2>
          <p>{insight.summary}</p>
          <ul>
            {insight.keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### 9. 알림 (Notifications)

```tsx
import {
  useNotifications,
  useDeleteNotification,
  useMarkNotificationAsRead,
  useUpdateNotificationSettings,
} from "@/lib/api";

function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const deleteNotif = useDeleteNotification();
  const markAsRead = useMarkNotificationAsRead();

  const handleDelete = async (id: string) => {
    await deleteNotif.mutateAsync(id);
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead.mutateAsync(id);
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {notifications?.map((notif) => (
        <div key={notif.id}>
          <p>{notif.title}</p>
          <p>{notif.message}</p>
          {!notif.isRead && <button onClick={() => handleMarkAsRead(notif.id)}>읽음 처리</button>}
          <button onClick={() => handleDelete(notif.id)}>삭제</button>
        </div>
      ))}
    </div>
  );
}

function NotificationSettingsPage() {
  const updateSettings = useUpdateNotificationSettings();

  const handleUpdate = async () => {
    await updateSettings.mutateAsync({
      emailAlerts: true,
      weeklyReports: false,
      riskThreshold: "YELLOW",
    });
  };

  return <button onClick={handleUpdate}>설정 저장</button>;
}
```

### 10. 통계

```tsx
import { useStatistics } from "@/lib/api";

function StatisticsPage() {
  const { data: stats, isLoading } = useStatistics();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      <p>전체 사업체 수: {stats?.totalBusinesses.toLocaleString()}</p>
      <p>폐업률: {stats?.closureRate}%</p>
      <p>평균 생존 기간: {stats?.averageSurvivalYears}년</p>
    </div>
  );
}
```

### 11. 성공 사례

```tsx
import { useSuccessStories } from "@/lib/api";

function SuccessStoriesPage() {
  const { data: stories, isLoading } = useSuccessStories();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {stories?.map((story) => (
        <div key={story.id}>
          <h2>{story.businessName}</h2>
          <p>{story.story}</p>
          <p>
            개선 전: {story.beforeScore} → 개선 후: {story.afterScore}
          </p>
          <ul>
            {story.improvements.map((improvement, idx) => (
              <li key={idx}>{improvement}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### 12. 문의하기

```tsx
import { useSubmitContact } from "@/lib/api";

function ContactPage() {
  const submit = useSubmitContact();

  const handleSubmit = async () => {
    try {
      const result = await submit.mutateAsync({
        name: "홍길동",
        email: "hong@example.com",
        subject: "문의사항",
        message: "서비스에 대해 궁금한 점이 있습니다.",
      });
      console.log("문의 제출 성공:", result);
    } catch (error) {
      console.error("문의 제출 실패:", error);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={submit.isPending}>
      {submit.isPending ? "제출 중..." : "문의하기"}
    </button>
  );
}
```

### 13. 프로필

```tsx
import { useProfile, useUpdateProfile } from "@/lib/api";

function ProfilePage() {
  const { data, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const handleUpdate = async () => {
    await updateProfile.mutateAsync({
      name: "홍길동",
      businessName: "행복한 카페",
      industry: "음식점",
    });
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      <p>이름: {data?.user.name}</p>
      <p>사업체명: {data?.user.businessName}</p>
      <p>업종: {data?.user.industry}</p>
      <button onClick={handleUpdate}>프로필 수정</button>
    </div>
  );
}
```

## 주요 특징

### 1. 자동 캐싱

TanStack Query가 자동으로 데이터를 캐싱하므로 불필요한 API 호출이 줄어듭니다.

```tsx
// 같은 데이터를 여러 컴포넌트에서 사용해도 한 번만 요청
function Component1() {
  const { data } = useFAQs(); // API 호출
}

function Component2() {
  const { data } = useFAQs(); // 캐시에서 가져옴
}
```

### 2. 자동 리프레시

mutation 후 관련 query가 자동으로 다시 fetch됩니다.

```tsx
const createPlan = useCreateActionPlan()

// 플랜 생성 후 useActionPlans()가 자동으로 다시 fetch됨
await createPlan.mutateAsync({ ... })
```

### 3. 로딩 및 에러 상태

각 hook이 로딩, 에러 상태를 제공합니다.

```tsx
const { data, isLoading, error } = useFAQs();

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
return <div>{data}</div>;
```

### 4. Optimistic Updates

낙관적 업데이트를 통해 UX를 개선할 수 있습니다.

```tsx
const queryClient = useQueryClient();
const markAsRead = useMarkNotificationAsRead();

const handleMarkAsRead = async (id: string) => {
  // 즉시 UI 업데이트 (낙관적)
  queryClient.setQueryData(queryKeys.notifications.all, (old: any) =>
    old.map((n: any) => (n.id === id ? { ...n, isRead: true } : n))
  );

  // 실제 API 호출
  await markAsRead.mutateAsync(id);
};
```

## MSW 설정

개발 환경에서 MSW가 자동으로 활성화됩니다 (`src/main.tsx` 참조).

프로덕션 환경에서는 실제 API를 사용하도록 `enableMocking` 함수의 조건을 수정하세요.

```tsx
async function enableMocking() {
  // development에서만 MSW 활성화
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  return worker.start();
}
```

## 주의사항

1. **인증 토큰**: 로그인 후 토큰이 `localStorage`에 자동 저장됩니다.
2. **Mock 데이터**: MSW handlers의 데이터는 메모리에 저장되므로 새로고침하면 초기화됩니다.
3. **실제 API 연동**: 프로덕션에서는 MSW를 비활성화하고 실제 API 엔드포인트를 사용하세요.

## 타입 안전성

모든 API 함수와 hook은 TypeScript로 작성되어 타입 안전성이 보장됩니다.

```tsx
// 자동 완성과 타입 체크
const login = useLogin();
login.mutateAsync({
  email: "test@example.com",
  password: "password123",
  // name: 'test' // ❌ 타입 에러: LoginRequest에 name 필드 없음
});
```

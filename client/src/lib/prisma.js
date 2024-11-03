import { prisma } from "@/lib/prisma"; // Prisma 클라이언트

// 세션을 데이터베이스에서 확인하는 함수
export async function verifySessionInDatabase(sessionId) {
  try {
    // 세션이 데이터베이스에 있는지 확인
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    // 세션이 없으면 false 반환
    if (!session) {
      return false;
    }

    // 세션이 만료되었는지 확인 (현재 시간과 만료 시간 비교)
    const isSessionExpired = new Date() > session.expiresAt;

    // 세션이 만료되었으면 false 반환
    if (isSessionExpired) {
      return false;
    }

    // 세션이 유효하면 true 반환
    return true;
  } catch (error) {
    console.error("Error verifying session in database:", error);
    return false;
  }
}

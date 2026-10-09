import { db } from "@/lib/db";

export type WallOfLoveNoteWithUser = {
  id: string;
  content: string;
  userId: string;
  theme: string;
  icon: string;
  likesCount: number;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export async function getApprovedNotes(): Promise<WallOfLoveNoteWithUser[]> {
  return await db.wallOfLoveNote.findMany({
    where: {
      approved: true,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function createNote({
  userId,
  content,
  theme = "purple",
  icon = "sparkles",
}: {
  userId: string;
  content: string;
  theme?: string;
  icon?: string;
}) {
  return await db.wallOfLoveNote.create({
    data: {
      userId,
      content: content.trim(),
      theme,
      icon,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function likeNote(noteId: string) {
  return await db.wallOfLoveNote.update({
    where: { id: noteId },
    data: {
      likesCount: {
        increment: 1,
      },
    },
  });
}

export async function deleteNote(noteId: string, userId: string, isAdmin = false) {
  const note = await db.wallOfLoveNote.findUnique({
    where: { id: noteId },
  });

  if (!note) return null;
  if (!isAdmin && note.userId !== userId) {
    throw new Error("Unauthorized to delete this note");
  }

  return await db.wallOfLoveNote.update({
    where: { id: noteId },
    data: {
      deletedAt: new Date(),
    },
  });
}

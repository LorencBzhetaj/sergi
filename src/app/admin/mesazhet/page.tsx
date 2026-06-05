import { prisma } from "@/lib/prisma";
import { MessageActions } from "./MessageActions";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-lg sm:text-xl font-bold tracking-widest">MESAZHET</h1>
        <p className="text-neutral-500 text-sm mt-1">
          {messages.length} mesazhe · <span className="text-[#C9A84C] font-medium">{unread} të palexuar</span>
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white border border-neutral-100 py-16 text-center text-neutral-400 text-sm">
          Nuk ka mesazhe ende.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white border p-4 sm:p-5 ${m.isRead ? "border-neutral-100" : "border-[#C9A84C]/40 bg-amber-50/30"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{m.name}</p>
                    {!m.isRead && (
                      <span className="text-[9px] bg-[#C9A84C] text-white px-1.5 py-0.5 rounded font-bold tracking-wide">
                        I RI
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-neutral-500 flex-wrap">
                    <a href={`mailto:${m.email}`} className="hover:text-black">{m.email}</a>
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="hover:text-black">{m.phone}</a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-neutral-400 whitespace-nowrap hidden sm:block">
                    {new Date(m.createdAt).toLocaleDateString("sq-AL")}
                  </span>
                  <MessageActions id={m.id} isRead={m.isRead} />
                </div>
              </div>
              <p className="text-sm text-neutral-600 mt-3 leading-relaxed whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

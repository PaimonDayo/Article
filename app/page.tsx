import { getReviews } from "../lib/notion";
import Image from "next/image";

export const revalidate = 0;

export default async function Home() {
  const reviews = await getReviews();

  return (
    <main className="min-h-screen bg-[#0f1115] text-gray-100 p-8 sm:p-12 md:p-20 font-sans selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
            My Reviews
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            日々プレイしているゲームや鑑賞した映画の個人的な記録と感想。
          </p>
        </header>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {reviews.map((review: any) => (
              <article
                key={review.id}
                className="group relative bg-[#1a1d24] rounded-2xl overflow-hidden shadow-lg border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col"
              >
                <div className="relative w-full aspect-video bg-gray-800 overflow-hidden">
                  {review.imageUrl ? (
                    <Image
                      src={review.imageUrl}
                      alt={review.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium">
                      No Image
                    </div>
                  )}

                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/10 shadow-sm">
                    {review.type}
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-yellow-400 border border-white/10 shadow-sm">
                    {review.rating}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow relative z-10">
                  <h2 className="text-xl font-bold mb-3 line-clamp-2 text-gray-100 group-hover:text-blue-400 transition-colors">
                    {review.title}
                  </h2>

                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
                    {review.review || "レビューはまだ書かれていません。"}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-800">
                    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md ${review.status === 'Finished' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      review.status === 'Playing/Watching' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${review.status === 'Finished' ? 'bg-emerald-400' :
                        review.status === 'Playing/Watching' ? 'bg-blue-400' : 'bg-gray-400'
                        }`}></span>
                      {review.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1a1d24] rounded-2xl border border-gray-800/50">
            <h3 className="text-xl font-bold text-gray-300 mb-2">Notionデータが未設定です</h3>
            <p className="text-gray-500 mb-4">
              `.env.local` ファイルに Notion トークンとデータベースIDを設定してください。
            </p>
            <div className="inline-block bg-black/50 p-4 rounded text-left border border-gray-800">
              <code className="text-blue-400 block mb-1">NOTION_TOKEN="secret_xxx..."</code>
              <code className="text-blue-400 block">NOTION_DATABASE_ID="xxx..."</code>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

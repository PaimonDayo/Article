import { getReview } from "../../lib/notion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const review = await getReview(id);

    if (!review) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#0f1115] text-gray-100 p-6 sm:p-12 md:p-20 font-sans selection:bg-purple-500/30">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8 font-medium">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    一覧に戻る
                </Link>

                <article className="bg-[#1a1d24] rounded-3xl overflow-hidden shadow-2xl border border-gray-800/50">
                    <div className="relative w-full aspect-video sm:aspect-[21/9] bg-gray-900 overflow-hidden">
                        {review.imageUrl ? (
                            <Image
                                src={review.imageUrl}
                                alt={review.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1200px) 100vw, 1200px"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium">
                                No Image
                            </div>
                        )}

                        <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/10 shadow-sm">
                            {review.type}
                        </div>
                    </div>

                    <div className="p-8 sm:p-12">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg text-sm font-bold shadow-sm">
                                {review.rating}
                            </span>
                            <span className={`inline-flex items-center text-sm font-bold px-3 py-1 rounded-lg ${review.status === 'Finished' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    review.status === 'Playing/Watching' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                }`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${review.status === 'Finished' ? 'bg-emerald-400' :
                                        review.status === 'Playing/Watching' ? 'bg-blue-400' : 'bg-gray-400'
                                    }`}></span>
                                {review.status}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-gray-100 leading-tight">
                            {review.title}
                        </h1>

                        <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-p:text-gray-300">
                            {review.review ? (
                                review.review.split('\n').map((line: string, i: number) => (
                                    <p key={i} className="mb-4">{line}</p>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">レビューはまだ書かれていません。</p>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ExternalLink,
  Play,
  TrendingUp,
  AlertCircle,
  Check,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { useFinancial } from '../context/FinancialContext';
import { educationalLessons } from '../data/educationalLessons';
import { EducationLesson } from '../types';
import { getRecommendedLessons } from '../utils/calculations';

export const LearnPage: React.FC = () => {
  const { showToast } = useToast();
  const { user, transactions, budgets, savingsGoals } = useFinancial();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeLesson, setActiveLesson] = useState<EducationLesson | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`finshield_completed_lessons_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const categories = [
    { id: 'ALL', label: 'All Lessons' },
    { id: 'Budgeting', label: 'Budgeting & Spending' },
    { id: 'Savings', label: 'Savings & Reserves' },
    { id: 'Investing', label: 'Investing & Compounding' },
    { id: 'Credit & Debt', label: 'Credit Scores & Debt' },
    { id: 'Digital Safety', label: 'Digital Safety & Scams' },
  ];

  // Dynamic adaptive recommendations derived from user's live financial data (Requirement 5)
  const adaptiveRecommendations = useMemo(() => {
    return getRecommendedLessons(educationalLessons, user, transactions, budgets, savingsGoals);
  }, [user, transactions, budgets, savingsGoals]);

  const filteredLessons = educationalLessons.filter(
    (l) => selectedCategory === 'ALL' || l.category === selectedCategory
  );

  const markCompleted = (id: string) => {
    if (!completedIds.includes(id)) {
      const updated = [...completedIds, id];
      setCompletedIds(updated);
      try {
        localStorage.setItem(`finshield_completed_lessons_${user.id}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      showToast('Lesson marked as completed! Knowledge badge updated.', 'success');
    }
    setActiveLesson(null);
  };

  const handleOpenExternal = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string | undefined,
    fallback: () => void
  ) => {
    if (!url || !url.trim().startsWith('http')) {
      e.preventDefault();
      showToast('Link unavailable or invalid. Opening in-app guide instead.', 'warning');
      fallback();
    }
  };

  const completionPct = Math.round((completedIds.length / educationalLessons.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Financial Literacy & Safety Academy
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Practical financial lessons with verified video resources and authority articles, tailored for young earners and students.
          </p>
        </div>

        {/* Completion Progress */}
        <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-lg border border-[#E5E5E5]">
          <Award className="w-5 h-5 text-[#8B1E3F]" />
          <div>
            <div className="flex items-center justify-between text-[11px] gap-2">
              <span className="font-bold text-[#242424]">Academy Progress</span>
              <span className="font-mono font-bold text-[#8B1E3F]">{completionPct}%</span>
            </div>
            <div className="w-24 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-[#8B1E3F] rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Personalized Learning / Adaptive Recommendations Banner (Requirement 5) */}
      {adaptiveRecommendations.length > 0 && (
        <Card className="p-5 bg-gradient-to-r from-[#F8E9EE] to-white border border-[#E9C8D4]">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#8B1E3F]" />
            <h2 className="text-xs font-bold text-[#8B1E3F] uppercase tracking-wider">
              Adaptive Personalized Learning (Based on Your Spending & Savings)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {adaptiveRecommendations.slice(0, 2).map(({ lesson, reason, trigger }) => (
              <div
                key={lesson.id}
                className="p-3.5 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#8B1E3F] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <Badge variant="warning">{trigger}</Badge>
                    <span className="text-[10px] text-[#6B6B6B]">{lesson.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#242424] mb-1">{lesson.title}</h3>
                  <p className="text-[11px] text-[#6B6B6B] leading-relaxed mb-3">{reason}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#F0F0F0] flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveLesson(lesson)}
                    icon={<BookOpen className="w-3.5 h-3.5" />}
                  >
                    Guide
                  </Button>
                  <a
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleOpenExternal(e, lesson.videoUrl, () => setActiveLesson(lesson))}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E3F] hover:underline px-2 py-1 rounded-md hover:bg-[#F8E9EE] transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Video</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {lesson.articleUrl && (
                    <a
                      href={lesson.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleOpenExternal(e, lesson.articleUrl, () => setActiveLesson(lesson))}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E3F] hover:underline px-2 py-1 rounded-md hover:bg-[#F8E9EE] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Read More</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#8B1E3F] text-white shadow-sm'
                : 'bg-white text-[#6B6B6B] hover:text-[#242424] border border-[#E5E5E5]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lessons Grid (Requirement 4: Title, Short description, Objectives, Embedded YouTube resource, Watch Video button in new tab) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const isDone = completedIds.includes(lesson.id);

          return (
            <Card
              key={lesson.id}
              className="p-5 bg-white border border-[#E5E5E5] hover:border-[#8B1E3F] hover:shadow-cardHover transition-all flex flex-col justify-between"
            >
              <div>
                {/* Badges & Completion */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="neutral">{lesson.category}</Badge>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant={
                        lesson.difficulty === 'Essential'
                          ? 'danger'
                          : lesson.difficulty === 'Beginner'
                          ? 'success'
                          : 'primary'
                      }
                    >
                      {lesson.difficulty}
                    </Badge>
                    {isDone && (
                      <span className="w-5 h-5 rounded-full bg-[#EAF5EC] text-[#218739] flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#242424] leading-snug mb-2">
                  {lesson.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">
                  {lesson.summary}
                </p>

                {/* Video Resource Embed (Requirement 4) */}
                <div className="mb-4 overflow-hidden rounded-md border border-[#E5E5E5] bg-black">
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={lesson.videoEmbedUrl}
                      title={lesson.videoTitle || lesson.title}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2 bg-[#FAFAFA] border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#6B6B6B]">
                    <span className="truncate max-w-[190px] font-medium">{lesson.videoSource || 'Educational Video'}</span>
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#8B1E3F] hover:underline flex items-center gap-1 shrink-0"
                    >
                      <span>Open YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Learning Objectives List (Requirement 4) */}
                <div className="mb-4 p-3 bg-[#FAFAFA] rounded-md border border-[#F0F0F0] text-xs">
                  <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-2">
                    Learning Objectives:
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-[#242424]">
                    {lesson.objectives.slice(0, 3).map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#218739] shrink-0 mt-0.5" />
                        <span className="leading-snug">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions: Watch Video & Read More in New Tab */}
              <div className="pt-3 border-t border-[#F0F0F0] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveLesson(lesson)}
                  className="text-[11px] text-[#6B6B6B] hover:text-[#8B1E3F] flex items-center gap-1 font-medium transition-colors cursor-pointer w-full sm:w-auto text-left"
                  title="Click to view interactive in-app study guide"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lesson.readTime}</span>
                  <span className="text-[#8B1E3F] font-semibold ml-1">· View Guide</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                  {/* Watch Video button */}
                  <a
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleOpenExternal(e, lesson.videoUrl, () => setActiveLesson(lesson))}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#8B1E3F] text-[#8B1E3F] hover:bg-[#F8E9EE] text-xs font-bold transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch Video</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {/* Read More button */}
                  <a
                    href={lesson.articleUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleOpenExternal(e, lesson.articleUrl, () => setActiveLesson(lesson))}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#8B1E3F] text-white hover:bg-[#64152E] text-xs font-bold transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Read More</span>
                  </a>

                  {/* Optional quick guide modal trigger */}
                  <Button
                    variant={isDone ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveLesson(lesson)}
                    icon={<BookOpen className="w-3 h-3" />}
                    className="!px-2 !py-1 text-xs"
                  >
                    {isDone ? 'Revisit' : 'Notes'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Lesson Reading Modal */}
      <Modal
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        title={activeLesson?.title || 'Lesson Guide'}
      >
        {activeLesson && (
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0F0F0]">
              <Badge variant="primary">{activeLesson.category}</Badge>
              <Badge variant="neutral">{activeLesson.difficulty}</Badge>
              <span className="text-xs text-[#6B6B6B] ml-auto flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {activeLesson.readTime}
              </span>
            </div>

            {/* Video Player in Modal */}
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#E5E5E5] bg-black">
              <iframe
                src={activeLesson.videoEmbedUrl}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-[#FAFAFA] rounded-md border border-[#E5E5E5]">
              <span className="text-xs text-[#6B6B6B]">
                Video: <strong>{activeLesson.videoSource || 'Educational Video'}</strong>
                {activeLesson.articleSource && (
                  <span className="ml-2">| Source: <strong>{activeLesson.articleSource}</strong></span>
                )}
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={activeLesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleOpenExternal(e, activeLesson.videoUrl, () => {})}
                  className="text-xs font-bold text-[#8B1E3F] hover:underline flex items-center gap-1"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                {activeLesson.articleUrl && (
                  <>
                    <span className="text-[#C0C0C0]">|</span>
                    <a
                      href={activeLesson.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleOpenExternal(e, activeLesson.articleUrl, () => {})}
                      className="text-xs font-bold text-[#8B1E3F] hover:underline flex items-center gap-1"
                    >
                      <span>Read Full Article</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Learning Objectives in Modal */}
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">
              <span className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider block mb-2">
                Core Learning Objectives
              </span>
              <ul className="space-y-1.5 text-xs text-[#334155]">
                {activeLesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#218739] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Full Content */}
            <div className="space-y-3 text-xs leading-relaxed text-[#242424]">
              {activeLesson.fullContent.map((paragraph, idx) => (
                <p key={idx} className="text-justify">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Takeaway Box */}
            <div className="p-3.5 bg-[#F8E9EE] border border-[#8B1E3F]/20 rounded-md">
              <span className="text-[11px] font-bold text-[#8B1E3F] uppercase tracking-wider block mb-1">
                Core Takeaway
              </span>
              <p className="text-xs font-semibold text-[#242424]">
                {activeLesson.keyTakeaway}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F0]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveLesson(null)}
              >
                Close
              </Button>

              <Button
                size="sm"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => markCompleted(activeLesson.id)}
              >
                {completedIds.includes(activeLesson.id) ? 'Completed' : 'Mark as Completed (+50 XP)'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LearnPage;

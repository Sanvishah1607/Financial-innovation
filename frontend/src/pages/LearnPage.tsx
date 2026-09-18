import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Lock,
  ChevronRight,
  Share2
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { mockEducationLessons } from '../data/mockEducation';
import { EducationLesson } from '../types';

export const LearnPage: React.FC = () => {
  const { addToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeLesson, setActiveLesson] = useState<EducationLesson | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>(['lesson-1', 'lesson-4']);

  const categories = [
    { id: 'ALL', label: 'All Topics' },
    { id: 'Digital Safety', label: 'Digital Safety & Scams' },
    { id: 'Smart Budgeting', label: 'Smart Budgeting' },
    { id: 'Investing Basics', label: 'Investing & Wealth' },
    { id: 'Credit & Loans', label: 'Credit Scores & Debt' }
  ];

  const filteredLessons = mockEducationLessons.filter(
    l => selectedCategory === 'ALL' || l.category === selectedCategory
  );

  const markCompleted = (id: string) => {
    if (!completedIds.includes(id)) {
      setCompletedIds(prev => [...prev, id]);
      addToast('success', 'Lesson marked as completed! Knowledge badge updated.');
    }
    setActiveLesson(null);
  };

  const completionPct = Math.round((completedIds.length / mockEducationLessons.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Financial Literacy & Safety Academy
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Bite-sized, practical financial lessons tailored for students and young Indian professionals.
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
                className="h-full bg-[#8B1E3F] rounded-full transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
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

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map(lesson => {
          const isDone = completedIds.includes(lesson.id);

          return (
            <Card
              key={lesson.id}
              className="p-5 bg-white border border-[#E5E5E5] hover:border-[#8B1E3F] hover:shadow-cardHover transition-all flex flex-col justify-between"
            >
              <div>
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

                <h3 className="text-base font-bold text-[#242424] leading-snug mb-2">
                  {lesson.title}
                </h3>

                <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">
                  {lesson.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
                <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> {lesson.readTime}
                </span>

                <Button
                  variant={isDone ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => setActiveLesson(lesson)}
                  icon={<BookOpen className="w-3.5 h-3.5" />}
                >
                  {isDone ? 'Revisit' : 'Read Lesson'}
                </Button>
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

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Star,
  Play,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Course, Student } from '../types';
import { api } from '../services/api';

interface CoursesAndLearningProps {
  student: Student;
  onRefreshProfile: () => void;
  onSelectTab: (tab: string) => void;
}

export const CoursesAndLearning: React.FC<CoursesAndLearningProps> = ({
  student,
  onRefreshProfile,
  onSelectTab
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourseProgress, setActiveCourseProgress] = useState<any>({
    courseId: 'crs_pytorch',
    completedLessons: 9,
    totalLessons: 12,
    progress: 75
  });
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const list = await api.getCourses();
      setCourses(list || []);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteNextLesson = async () => {
    const nextLessons = Math.min(activeCourseProgress.totalLessons, activeCourseProgress.completedLessons + 1);
    const newProgress = Math.round((nextLessons / activeCourseProgress.totalLessons) * 100);
    const updated = {
      ...activeCourseProgress,
      completedLessons: nextLessons,
      progress: newProgress
    };
    setActiveCourseProgress(updated);

    if (newProgress === 100) {
      // Award evidence
      await api.addEvidence({
        skill: 'PyTorch',
        sourceType: 'course',
        sourceTitle: 'Completed: Production Deep Learning with PyTorch',
        details: 'Finished all 12 modules and practical coding assignments on transformer architectures.',
        confidence: 0.95
      });
      onRefreshProfile();
      setCompletionNotice('Course completed! Verified skill evidence has been added to your profile graph.');
      setTimeout(() => setCompletionNotice(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Courses & Skill Roadmaps
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Take targeted courses to close your identified skill gaps and gain verified evidence.
        </p>
      </div>

      {completionNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{completionNotice}</span>
        </div>
      )}

      {/* Active In-Progress Course Card */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600">
              Active Course
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">Production Deep Learning with PyTorch</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Module 10: Multi-Head Self Attention & FlashAttention Optimizations
            </p>
          </div>

          <button
            id="btn-complete-lesson"
            onClick={handleCompleteNextLesson}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Complete Next Lesson ({activeCourseProgress.completedLessons}/{activeCourseProgress.totalLessons})</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Syllabus Completion</span>
            <span className="text-indigo-600 font-semibold">{activeCourseProgress.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${activeCourseProgress.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommended Courses Catalog */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-slate-900">Recommended Courses</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(courses || []).map(course => (
            <motion.div
              key={course.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-semibold text-slate-700">{course.rating}</span>
                  </div>
                </div>

                <h4 className="font-semibold text-sm text-slate-900 mt-1">{course.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{course.description}</p>

                {/* Skills gained */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {(course.skills || []).map(sk => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 border border-slate-200 text-slate-600"
                    >
                      +{sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {course.durationHours} hrs • {course.totalLessons} lessons
                </span>
                <button
                  onClick={() => {
                    setActiveCourseProgress({
                      courseId: course.id,
                      completedLessons: 0,
                      totalLessons: course.totalLessons,
                      progress: 0
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>Start Course</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectLang } from 'src/State/LangState/lang.reducer';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform
{
  isArabic: boolean = false;
  constructor(private store: Store) { }
  transform(value: string): unknown
  {
    this.store.select(selectLang).subscribe(isArabic =>
    {
      this.isArabic = isArabic;
    });
    if (this.isArabic)
    {
      return this.toArabic(value);
    } else
    {
      return this.toEnglish(value);
    }
  }

  toEnglish(value: string)
  {
    switch (value)
    {
      case 'firstSectionText': return ` Computer science is not about just learning programming languages. It is about learning how to find
      the best algorithms to solve problems and use programming languages to solve them.`;
      case "LearBasicsText": return `Teach you the basics of computer 
      science before teaching
      programming languages by teaching you the fundamental courses
      such as <span class="fw-bold">data structure</span> and 
      <span class="fw-bold">algorithms</span>.`;
      case 'ProblemSolvingText': return `Teaching you how to program by 
      teaching you how to solve problems using
      best algorithms.`;
      case 'HowToWriteCodeText': return `Teaching you how to use programming languages to solve problems.`;
      case 'AllCoursesPageDescription': return `In this page you can find all courses. You can also use the search box in the sidebar.`;
      case 'selectLesson': return `Select a lesson from the side menu`;
      case 'AllCategoriesDesc': return `In this page you can find all categories. You can also use the search box in the sidebar.`;
      default: return value;
    }
  }
  toArabic(value: string)
  {
    switch (value)
    {
      case 'Home': return 'الرئيسية';
      case 'Content': return 'المحتوى';
      case 'Learn Computer Science and progrmming': return 'تعلم علوم الحاسب والبرمجة';
      case 'firstSectionText': return `ليس هدف علوم الحاسب هو تعلم لغات البرمجة فقط ولكن هدفها هو تعلم كيفية حل المشكلات عن طريق
       ايجاد افضل خوارزمية وتطبيق الحل باستخدام لغات البرمجة`;
      case 'View all courses': return 'عرض جميع الدورات';
      case "Our Goal": return "هدفنا";
      case 'Learn basics': return 'تعلم الأساسيات';
      case "LearBasicsText": return `هدفنا هو تدريسك اساسيات علوم الحاسب قبل تدريس لغات البرمجة من خلال تدريس الدورات الاساسية مثل <span class="fw-bold">الرياضيات</span> <span class="fw-bold"> وبنية الباينات (data structure)</span> <span class="fw-bold"> والخوارزميات (Algorithms)</span>.`;
      case "Problem solving": return "حل المشكلات";
      case 'ProblemSolvingText': return `هدفنا هو تدريسك لكيفية حل المشكلات عن طريق ايجاد افضل خوارزمية وتطبيق الحل باستخدام لغات البرمجة`;
      case 'How to write code?': return 'تعلم كتابة الكود';
      case 'HowToWriteCodeText': return `هدفنا هو تدريسك لكيفية استخدام لغات البرمجة لحل المشكلات`;
      case 'Start learning coding today!': return 'ابدأ تعلم البرمجة اليوم!';
      case 'If you have any question, please contact us.': return 'اذا كان لديك أي أسئلة، يرجى الاتصال بنا.';
      case "Pages": return "أقراء";
      case "Privacy policy": return "سياسة الخصوصية";
      case "Contact us": return "اتصل بنا";
      case "Follow us": return "تابعنا";
      case "Courses": return "الدورات";
      case 'AllCoursesPageDescription': return `هذه الصفحة تحتوي على جميع الدورات. يمكنك استخدام مربع البحث للتصفح بسرعة.`;
      case 'Introduction to the course': return 'مقدمة عن الدورة';
      case 'View': return 'عرض';
      case 'Previous': return 'السابق';
      case 'Next': return 'التالي';
      case 'selectLesson': return 'اختر درس من القائمة الجانبية';
      case 'Last modifed': return 'آخر تعديل';
      case 'What will you learn in this course?': return 'ما الذي ستتعلمه في هذه الدورة؟';
      case 'Course description': return 'وصف الدورة';
      case 'Target Audience': return 'هذه الدورة مخصصة لـ';
      case 'Course Requirements': return 'متطلبات الدورة';
      case 'Course Features': return 'مميزات الدورة';
      case 'Courses Categories': return 'أقسام الدورات';
      case 'AllCategoriesDesc': return `هذه الصفحة تحتوي على جميع الأقسام. يمكنك استخدام مربع البحث للتصفح بسرعة.`;
      case 'View Courses': return 'عرض الدورات';
      case 'Read More': return 'اقراء المزيد';
      case 'More': return 'المزيد';
      case 'Watch the video': return 'شاهد الفيديو';
      case 'The course you are looking for does not exist': return 'الدورة التي تبحث عنها غير موجودة';
      case 'Course not found': return 'الدورة غير موجودة';
      case 'Back to courses': return 'العودة للدورات';
      case 'Back to course': return 'العودة للدورة';
      case 'The lesson you are looking for does not exist in this course': return 'الدرس الذي تبحث عنه غير موجود في هذه الدورة';
      case 'Lesson not found': return 'الدرس غير موجود';
      case 'Course and lesson are not found': return 'الدورة والدرس غير موجودين';
      case "We can't find the course you are looking for": return 'لا يمكننا إيجاد الدورة التي تبحث عنها';
      default: return value;
    }
  }
}

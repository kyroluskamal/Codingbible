import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectLang } from 'src/State/LangState/lang.reducer';

@Pipe({
  name: 'translate'
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
      the best algorithms to solve problems and use programming languages to solve them.`; break;
      case "LearBasicsText": return `Teach you the basics of computer 
      science before teaching
      programming languages by teaching you the fundamental courses
      such as <span class="fw-bold">data structure</span> and 
      <span class="fw-bold">algorithms</span>.`; break;
      case 'ProblemSolvingText': return `Teaching you how to program by 
      teaching you how to solve problems using
      best algorithms.`; break;
      case 'HowToWriteCodeText': return `Teaching you how to use programming languages to solve problems.`; break;
      default: return value;
    }
  }
  toArabic(value: string)
  {
    switch (value)
    {
      case 'Home': return 'الرئيسية'; break;
      case 'Content': return 'المحتوى'; break;
      case 'Learn Computer Science and progrmming': return 'تعلم علوم الحاسب والبرمجة'; break;
      case 'firstSectionText': return `ليس هدف علوم الحاسب هو تعلم لغات البرمجة فقط ولكن هدفها هو تعلم كيفية حل المشكلات عن طريق
       ايجاد افضل خوارزمية وتطبيق الحل باستخدام لغات البرمجة`; break;
      case 'View all courses': return 'عرض جميع الدورات'; break;
      case "Our Goal": return "هدفنا"; break;
      case 'Learn basics': return 'تعلم الأساسيات'; break;
      case "LearBasicsText": return `هدفنا هو تدريسك اساسيات علوم الحاسب قبل تدريس لغات البرمجة من خلال تدريس الدورات الاساسية مثل <span class="fw-bold">الرياضيات</span> <span class="fw-bold"> وبنية الباينات (data structure)</span> <span class="fw-bold"> والخوارزميات (Algorithms)</span>.`; break;
      case "Problem solving": return "حل المشكلات"; break;
      case 'ProblemSolvingText': return `هدفنا هو تدريسك لكيفية حل المشكلات عن طريق ايجاد افضل خوارزمية وتطبيق الحل باستخدام لغات البرمجة`; break;
      case 'How to write code?': return 'تعلم كتابة الكود'; break;
      case 'HowToWriteCodeText': return `هدفنا هو تدريسك لكيفية استخدام لغات البرمجة لحل المشكلات`; break;
      case 'Start learning coding today!': return 'ابدأ تعلم البرمجة اليوم!'; break;
      case 'If you have any question, please contact us.': return 'اذا كان لديك أي أسئلة، يرجى الاتصال بنا.'; break;
      case "Pages": return "أقراء"; break;
      case "Privacy policy": return "سياسة الخصوصية"; break;
      case "Contact us": return "اتصل بنا"; break;
      case "Follow us": return "تابعنا"; break;
      default: return value;
    }
  }
}

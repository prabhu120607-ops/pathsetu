import { Career, StudentProfile, RecommendationMatch } from '../types';
import { CAREERS } from '../data/careers';

export const SCORING_WEIGHTS = {
  interest: 0.35,
  subject: 0.25,
  skill: 0.20,
  education: 0.15,
  workstyle: 0.05,
};

export function computeRecommendations(
  profile: Partial<StudentProfile>,
  careerCatalog: Career[] = CAREERS
): RecommendationMatch[] {
  const userInterests = (profile.interests || []).map(i => i.toLowerCase().trim());
  const userSubjects = (profile.subjects || []).map(s => s.toLowerCase().trim());
  const userSkills = (profile.existingSkills || []).map(s => s.toLowerCase().trim());
  const userEdu = (profile.educationLevel || '').trim();
  const userWorkstyle = (profile.workstyle || '').trim();

  const results: RecommendationMatch[] = careerCatalog.map(career => {
    // 1. Interest Alignment (35 pts max)
    const careerInterests = career.target_interests.map(i => i.toLowerCase().trim());
    const matchedInterests = userInterests.filter(ui =>
      careerInterests.some(ci => ci.includes(ui) || ui.includes(ci))
    );
    const interestRatio = careerInterests.length > 0
      ? Math.min(matchedInterests.length / Math.max(careerInterests.length, 1), 1.0)
      : 0.5;
    const interestScore = interestRatio * SCORING_WEIGHTS.interest * 100;

    // 2. Subject Alignment (25 pts max)
    const careerSubjects = career.target_subjects.map(s => s.toLowerCase().trim());
    const matchedSubjects = userSubjects.filter(us =>
      careerSubjects.some(cs => cs.includes(us) || us.includes(cs))
    );
    const subjectRatio = careerSubjects.length > 0
      ? Math.min(matchedSubjects.length / Math.max(careerSubjects.length, 1), 1.0)
      : 0.5;
    const subjectScore = subjectRatio * SCORING_WEIGHTS.subject * 100;

    // 3. Skill Alignment (20 pts max)
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    career.required_skills.forEach(req => {
      const isPresent = userSkills.some(us =>
        us.includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(us)
      );
      if (isPresent) {
        matchedSkills.push(req.name);
      } else {
        missingSkills.push(req.name);
      }
    });
    const totalReqSkills = career.required_skills.length;
    const skillRatio = totalReqSkills > 0
      ? Math.min(matchedSkills.length / totalReqSkills, 1.0)
      : 0.4;
    const skillScore = skillRatio * SCORING_WEIGHTS.skill * 100;

    // 4. Education Pathway Compatibility (15 pts max)
    let eduRatio = 0.5;
    if (userEdu) {
      const matchesLevel = career.target_education_levels.some(lvl =>
        lvl.toLowerCase().includes(userEdu.toLowerCase()) || userEdu.toLowerCase().includes(lvl.toLowerCase())
      );
      eduRatio = matchesLevel ? 1.0 : 0.6;
    }
    const educationScore = eduRatio * SCORING_WEIGHTS.education * 100;

    // 5. Work-style Preference (5 pts max)
    let workstyleRatio = 0.5;
    if (userWorkstyle) {
      workstyleRatio = userWorkstyle === career.typical_workstyle ? 1.0 : 0.4;
    }
    const workstyleScore = workstyleRatio * SCORING_WEIGHTS.workstyle * 100;

    const rawTotal = interestScore + subjectScore + skillScore + educationScore + workstyleScore;
    const compatibilityScore = Math.min(Math.max(Math.round(rawTotal), 30), 98);

    // Build transparent rationale
    const rationaleParts: string[] = [];
    if (matchedInterests.length > 0) {
      rationaleParts.push(`Aligns with ${matchedInterests.length} of your stated interests (${matchedInterests.slice(0, 3).join(', ')}).`);
    }
    if (matchedSubjects.length > 0) {
      rationaleParts.push(`Strong academic foundation in ${matchedSubjects.slice(0, 2).join(', ')}.`);
    }
    if (matchedSkills.length > 0) {
      rationaleParts.push(`You already possess ${matchedSkills.length} relevant skill(s): ${matchedSkills.slice(0, 2).join(', ')}.`);
    } else {
      rationaleParts.push(`Great entry track to build foundational skills from scratch.`);
    }
    if (userEdu && eduRatio >= 0.9) {
      rationaleParts.push(`Directly compatible with your current education stage.`);
    }

    return {
      career,
      compatibilityScore,
      breakdown: {
        interestScore: Math.round(interestScore * 10) / 10,
        subjectScore: Math.round(subjectScore * 10) / 10,
        skillScore: Math.round(skillScore * 10) / 10,
        educationScore: Math.round(educationScore * 10) / 10,
        workstyleScore: Math.round(workstyleScore * 10) / 10,
      },
      matchedInterests,
      matchedSubjects,
      matchedSkills,
      missingSkills,
      rationale: rationaleParts.join(' ')
    };
  });

  return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

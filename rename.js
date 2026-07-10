const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = content.replace(/degree_id/g, 'course_id');
  content = content.replace(/degreeId/g, 'courseId');
  content = content.replace(/degreeName/g, 'courseName');
  content = content.replace(/degrees\(/g, 'courses(');
  content = content.replace(/degrees\?/g, 'courses?');
  content = content.replace(/degrees\./g, 'courses.');
  content = content.replace(/degrees /g, 'courses ');
  content = content.replace(/degrees:/g, 'courses:');
  content = content.replace(/degree /g, 'course ');
  content = content.replace(/degree\./g, 'course.');
  content = content.replace(/degree:/g, 'course:');
  content = content.replace(/degree\?/g, 'course?');
  content = content.replace(/Degree/g, 'Course');
  content = content.replace(/'degrees'/g, "'courses'");
  content = content.replace(/'degree'/g, "'course'");
  content = content.replace(/session_degrees/g, 'session_courses');
  content = content.replace(/session_degree_subjects/g, 'session_course_subjects');
  content = content.replace(/sessionDegreeId/g, 'sessionCourseId');
  content = content.replace(/degree_subjects/g, 'course_subjects');
  
  // also fix some imports/props
  content = content.replace(/degrees=\{/g, 'courses={');
  content = content.replace(/degrees=/g, 'courses=');
  content = content.replace(/degree=/g, 'course=');
  content = content.replace(/degrees\)/g, 'courses)');
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

walk('src');

// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  function getCurrentDate() {
    const d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) { 
        month = '0' + month;
    }

    if (day.length < 2) { 
        day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  function getLearnerData(course, ag, submissions) {
    const currentDate = getCurrentDate();

    // filtering assignments due (i.e. assignments with due_at field less or equal than currentDate)
    const agDue = ag.assignments.filter(
        (a) => a.due_at.localeCompare(currentDate) <= 0 
    );

    const result = [];
  
    // filter LearnerSubmissions to keep submissions with unique learner_id
    // https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
    const submissionsUniqueLearner = submissions.filter(
        (a, i) => submissions.findIndex((s) => a.learner_id === s.learner_id) === i
    );

    // loop though submissions with unique learner_id
    for (let i = 0; i < submissionsUniqueLearner.length; i++) {
        const learnerId = submissionsUniqueLearner[i].learner_id; 
        // create an object
        const learner = {};
        
        // set id to learnerId
        learner['id'] = learnerId;

        const learnerSubmissions = submissions.filter(
          (a, i) => a.learner_id === learnerId
        );

        let learnerScore = 0;
        let totalPointsPossible = 0;
        for (const assignmentDue of agDue) {
          let scoreForAssignment = 0;
          for (const learnerSubmission of learnerSubmissions) {
            if (learnerSubmission.assignment_id === assignmentDue.id) {
              scoreForAssignment = learnerSubmission.submission.score;

              let percentToSustract = 0;
              if (learnerSubmission.submission.submitted_at.localeCompare(assignmentDue.due_at) > 0) {
                percentToSustract = 0.1;
              } else {
                percentToSustract = 0;
              }

              scoreForAssignment -= percentToSustract * assignmentDue.points_possible;

              learnerScore += scoreForAssignment;
            }
          }

          learner[assignmentDue.id] = scoreForAssignment / assignmentDue.points_possible;
          totalPointsPossible += assignmentDue.points_possible;
        }

        learner.avg = learnerScore / totalPointsPossible;

        // push the object to result array
        result.push(learner);
    }

    return result;
  }
  
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
  console.log(result);
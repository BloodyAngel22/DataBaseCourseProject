using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Discipline
{
    public string Name { get; set; } = null!;

    public virtual ICollection<ExamDiscipline> ExamDisciplines { get; set; } = new List<ExamDiscipline>();
}

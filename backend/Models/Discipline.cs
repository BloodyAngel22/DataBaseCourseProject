using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models;

public partial class Discipline
{
    public string Name { get; set; } = null!;

	[JsonIgnore]
    public virtual ICollection<ExamDiscipline> ExamDisciplines { get; set; } = new List<ExamDiscipline>();
}

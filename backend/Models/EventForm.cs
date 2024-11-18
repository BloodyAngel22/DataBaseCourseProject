using System;
using System.Collections.Generic;

namespace backend.Models;

/// <summary>
/// Форма проведения предмета
/// </summary>
public partial class EventForm
{
    public string Type { get; set; } = null!;

    public virtual ICollection<ExamDiscipline> ExamDisciplines { get; set; } = new List<ExamDiscipline>();
}

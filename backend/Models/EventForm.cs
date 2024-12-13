using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models;

/// <summary>
/// Форма проведения предмета
/// </summary>
public partial class EventForm
{
    public string Type { get; set; } = null!;

	[JsonIgnore]
    public virtual ICollection<ExamDiscipline> ExamDisciplines { get; set; } = new List<ExamDiscipline>();
}

using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models;

/// <summary>
/// Преподаватель
/// </summary>
public partial class Lecturer
{
    public Guid Id { get; set; }

    public string Firstname { get; set; } = null!;

    public string Surname { get; set; } = null!;

    public string? Patronymic { get; set; }

    public DateOnly Birthdate { get; set; }

    public string DepartmentName { get; set; } = null!;

	[JsonIgnore]
    public virtual Department DepartmentNameNavigation { get; set; } = null!;

	[JsonIgnore]
    public virtual ICollection<ExamDiscipline> ExamDisciplines { get; set; } = new List<ExamDiscipline>();
}

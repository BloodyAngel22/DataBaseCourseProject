using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models;

/// <summary>
/// Экзамеционная дисциплина
/// </summary>
public partial class ExamDiscipline
{
    public Guid Id { get; set; }

    public string DisciplineName { get; set; } = null!;

    public DateTime EventDatetime { get; set; }

    public Guid LecturerId { get; set; }

    public string CabinetRoomName { get; set; } = null!;

    public string EventFormType { get; set; } = null!;

	[JsonIgnore]
    public virtual Cabinet CabinetRoomNameNavigation { get; set; } = null!;

	[JsonIgnore]
    public virtual Discipline DisciplineNameNavigation { get; set; } = null!;

	[JsonIgnore]
    public virtual EventForm EventFormTypeNavigation { get; set; } = null!;

    public virtual Lecturer Lecturer { get; set; } = null!;

	[JsonIgnore]
    public virtual ICollection<Statement> Statements { get; set; } = new List<Statement>();
}


public partial class ExamDisciplineGetData
{
    public Guid Id { get; set; }

    public string DisciplineName { get; set; } = null!;

    public DateTime EventDatetime { get; set; }

    public Guid LecturerId { get; set; }

    public string CabinetRoomName { get; set; } = null!;

    public string EventFormType { get; set; } = null!;

    public virtual Cabinet CabinetRoomNameNavigation { get; set; } = null!;

    public virtual Discipline DisciplineNameNavigation { get; set; } = null!;

    public virtual EventForm EventFormTypeNavigation { get; set; } = null!;

    public virtual Lecturer Lecturer { get; set; } = null!;

	[JsonIgnore]
    public virtual ICollection<Statement> Statements { get; set; } = new List<Statement>();
}

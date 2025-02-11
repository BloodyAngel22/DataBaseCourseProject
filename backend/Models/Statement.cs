﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace backend.Models;

/// <summary>
/// Ведомость
/// </summary>
public partial class Statement
{
    public Guid Id { get; set; }

    public Guid ExamDisciplineId { get; set; }

    public short SessionYear { get; set; }

    public DateOnly DateIssued { get; set; }

    public virtual ExamDiscipline ExamDiscipline { get; set; } = null!;

	[JsonIgnore]
    public virtual ICollection<Mark> Marks { get; set; } = new List<Mark>();
}

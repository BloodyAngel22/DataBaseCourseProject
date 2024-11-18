using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class DisciplineLog
{
    public string Discipline { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}

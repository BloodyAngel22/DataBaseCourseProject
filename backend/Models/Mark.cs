using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Mark
{
    public string Mark1 { get; set; } = null!;

    public Guid StudentId { get; set; }

    public Guid StatementId { get; set; }

    public virtual Statement Statement { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}

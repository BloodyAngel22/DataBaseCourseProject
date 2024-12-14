using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Filters
{
    public class StatementFilter
    {
        public string? EventDateTimeStart { get; set; }
		public string? EventDateTimeEnd { get; set; }

		public string? SessionYear { get; set; }

		public string? DateIssuedStart { get; set; }
		public string? DateIssuedEnd { get; set; }
    }
}
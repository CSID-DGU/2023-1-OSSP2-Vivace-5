import { Controller } from "@nestjs/common";
import { AnalysisService } from "./analysis.service";

@Controller("analysis")
export class AnalysisController {
    constructor(private analysisService: AnalysisService) {}
}
